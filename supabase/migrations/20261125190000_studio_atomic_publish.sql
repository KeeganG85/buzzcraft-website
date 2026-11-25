-- Publish one approved Studio version and advance the public pointer in one
-- database transaction. A failed insert or update rolls the entire call back.
create or replace function public.publish_studio_article_version(
  p_article_id uuid,
  p_content_json jsonb,
  p_content_html text,
  p_metadata_json jsonb,
  p_created_by text,
  p_revision_notes text,
  p_approved_by text
)
returns setof public.studio_articles
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
declare
  article_row public.studio_articles%rowtype;
  next_version_number integer;
  version_id uuid;
begin
  select * into article_row
  from public.studio_articles
  where id = p_article_id
  for update;

  if not found then
    return;
  end if;

  select coalesce(max(version_number), 0) + 1
  into next_version_number
  from public.article_versions
  where article_id = p_article_id;

  insert into public.article_versions (
    article_id,
    version_number,
    content_json,
    content_html,
    metadata_json,
    created_by,
    revision_notes,
    approval_status,
    approved_by,
    approved_at
  ) values (
    p_article_id,
    next_version_number,
    coalesce(p_content_json, '{}'::jsonb),
    coalesce(p_content_html, ''),
    coalesce(p_metadata_json, '{}'::jsonb),
    coalesce(nullif(p_created_by, ''), 'studio'),
    coalesce(p_revision_notes, 'Published from Studio'),
    'approved',
    coalesce(nullif(p_approved_by, ''), 'studio'),
    now()
  )
  returning id into version_id;

  update public.studio_articles
  set
    status = 'published',
    published_version_id = version_id,
    published_at = coalesce(published_at, now()),
    updated_at = now()
  where id = p_article_id
  returning * into article_row;

  return next article_row;
end;
$$;

revoke all on function public.publish_studio_article_version(uuid, jsonb, text, jsonb, text, text, text)
  from public, anon, authenticated;
grant execute on function public.publish_studio_article_version(uuid, jsonb, text, jsonb, text, text, text)
  to service_role;

comment on function public.publish_studio_article_version(uuid, jsonb, text, jsonb, text, text, text) is
  'Atomically stores an approved article version and advances the published pointer for Studio.';
